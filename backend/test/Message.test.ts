import {ethers} from "hardhat";
import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ContractReceipt} from "ethers";
import {TransactionResponse} from "@ethersproject/abstract-provider";
import {Message, Message__factory} from "../typechain-types";

describe("Message contract", () => {

    let contractFactory: Message__factory;
    let contract: Message;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;

    before(async () => {
        contractFactory = await ethers.getContractFactory("Message");
        [owner, addr1, addr2] = await ethers.getSigners();
    });

    describe("Deployment", () => {

        before(async () => {
            contract = await contractFactory.deploy();
        });

        it("Should set the owner", async () => {
            expect(await contract.owner()).to.equal(owner.address);
        });

        it("Should set initial message", async () => {
            expect(await contract.message()).to.equal("Hello world");
            expect(await contract.author()).to.equal(owner.address);
            expect(await contract.price()).to.equal(0);
        });

        it("Should set initial feeRate", async () => {
            expect(await contract.feeRate()).to.equal(0);
        });
    });

    describe("Management", () => {

        beforeEach(async () => {
            contract = await contractFactory.deploy();
        });

        it("Should set new owner", async () => {
            await expect(contract.setOwner(addr1.address)).to
                .emit(contract, "OwnershipTransferred")
                .withArgs(owner.address, addr1.address);
            expect(await contract.owner()).to.equal(addr1.address);
        });

        it("Should revert setting new owner by not owner account", async () => {
            await expect(contract.connect(addr1).setOwner(addr2.address)).to.revertedWith("Only owner");
        });

        it("Should set new fee rate", async () => {
            let newFeeRate = 100;

            await expect(contract.setFeeRate(newFeeRate)).to
                .emit(contract, "FeeRateSet")
                .withArgs(0, newFeeRate);
            expect(await contract.feeRate()).to.equal(newFeeRate);
        });

        it("Should revert setting new fee rate bigger than 100%", async () => {
            let feeRate = (await contract.feeParts()).add(1);
            await expect(contract.setFeeRate(feeRate)).to.revertedWith("Fee rate above 100%");
        });

        it("Should revert setting new fee rate by not owner account", async () => {
            await expect(contract.connect(addr1).setFeeRate(0)).to.revertedWith("Only owner");
        });
    });

    describe("Message change", () => {

        beforeEach(async () => {
            contract = await contractFactory.deploy();
        });

        it("Should set a new messages", async () => {
            let price1 = ethers.utils.parseEther("1");
            let message1 = "Message 1";

            let price2 = ethers.utils.parseEther("2");
            let message2 = "Message 2";

            const tx1 = await contract.connect(addr1).setMessage(message1, {value: price1});
            await expect(tx1)
                .to
                .emit(contract, "MessageSet")
                .withArgs(message1, addr1.address, price1)
                .to
                .changeEtherBalances([addr1, contract], [price1.mul(-1), price1]);
            expect(await contract.author()).to.equal(addr1.address);
            expect(await contract.price()).to.equal(price1);
            expect(await contract.message()).to.equal(message1);

            const tx2 = await contract.connect(addr2).setMessage(message2, {value: price2});
            await expect(tx2)
                .to
                .emit(contract, "MessageSet")
                .withArgs(message2, addr2.address, price2)
                .to
                .changeEtherBalances([addr2, contract], [price2.mul(-1), price2]);
            expect(await contract.author()).to.equal(addr2.address);
            expect(await contract.price()).to.equal(price2);
            expect(await contract.message()).to.equal(message2);
            expect(await contract.balanceOf(addr1.address)).to.equal(price1);
            expect(await contract.balanceOf(addr2.address)).to.equal(0);
        });

        it("Should revert setting new message due to insufficient funds", async () => {
            let price = ethers.utils.parseEther("1");
            await expect(contract.setMessage("Msg1", {value: price}))
                .to.emit(contract, "MessageSet")

            await expect(contract.connect(addr1).setMessage("Msg2", {value: price}))
                .to.revertedWith("Not enough ether");

            await expect(contract.connect(addr1).setMessage("Msg3", {value: price.sub(ethers.utils.parseEther("0.1"))}))
                .to.revertedWith("Not enough ether");
        });
    });

    describe("Withdraw funds", () => {

        beforeEach(async () => {
            contract = await contractFactory.deploy();
        });

        it("Should withdraw funds with no fee", async () => {
            // get initial wallet balances
            const addr1InitBalance = await addr1.getBalance();
            const addr2InitBalance = await addr2.getBalance();
            const price = ethers.utils.parseEther("1");

            // invoke multiple messages set
            const tx1 = await contract.connect(addr1).setMessage("msg", {value: price});
            const tx2 = await contract.connect(addr2).setMessage("msg", {value: price.mul(2)});
            const tx3 = await contract.connect(addr1).setMessage("msg", {value: price.mul(3)});
            const [receipt1, receipt2, receipt3] = [await tx1.wait(), await tx2.wait(), await tx3.wait()];

            // check balances before withdrawal
            let addr1Costs = tx1.value.add(tx3.value).add(getTxFees(receipt1, receipt3));
            let addr2Costs = tx2.value.add(getTxFees(receipt2));
            expect(await addr1.getBalance()).to.equal(addr1InitBalance.sub(addr1Costs));
            expect(await addr2.getBalance()).to.equal(addr2InitBalance.sub(addr2Costs));
            expect(await ethers.provider.getBalance(contract.address)).to.equal(getTxValues(tx1, tx2, tx3));

            // withdraw
            const txW = await contract.connect(addr1).withdraw();
            const receiptW = await txW.wait();
            await expect(txW)
                .to
                .emit(contract, "Withdrawal")
                .withArgs(addr1.address, price, 0)
                .to
                .changeEtherBalances([addr1, addr2, contract], [price, 0, price.mul(-1)]);

            // check wallet balances after withdrawal
            addr1Costs = tx3.value.add(getTxFees(receipt1, receipt3, receiptW));
            expect(await addr1.getBalance()).to.equal(addr1InitBalance.sub(addr1Costs));
            expect(await addr2.getBalance()).to.equal(addr2InitBalance.sub(addr2Costs));

            // check contract balances
            expect(await contract.balanceOf(addr1.address)).to.equal(0);
            expect(await contract.balanceOf(addr2.address)).to.equal(tx2.value);
            expect(await contract.balanceOf(owner.address)).to.equal(0); // no fee
            expect(await ethers.provider.getBalance(contract.address)).to.equal(getTxValues(tx2, tx3));
        });

        [
            {feeRate: 10000, expectedFee: 1},  // 100%
            {feeRate: 1000, expectedFee: 0.1}, // 10%
            {feeRate: 500, expectedFee: 0.05}, // 5%
            {feeRate: 10, expectedFee: 0.001}, // 0.1%
            {feeRate: 1, expectedFee: 0.0001}, // 0.01%
        ].forEach(({feeRate, expectedFee}) => {
            it(`Should withdraw funds with feeRate ${feeRate}`, async () => {
                const fee = ethers.utils.parseEther(expectedFee.toString());
                const price = ethers.utils.parseEther("1");
                contract.setFeeRate(feeRate);

                // invoke multiple messages set
                await contract.connect(addr1).setMessage("msg", {value: price});
                await contract.connect(addr2).setMessage("msg", {value: price.mul(2)});

                // withdraw
                const txW = await contract.connect(addr1).withdraw();
                await expect(txW)
                    .to
                    .emit(contract, "Withdrawal")
                    .withArgs(addr1.address, price.sub(fee), expectedFee)
                    .to
                    .changeEtherBalances([addr1, contract], [price.sub(fee), price.sub(fee).mul(-1)]);

                // check contract balances
                expect(await contract.balanceOf(addr1.address)).to.equal(0);
                expect(await contract.balanceOf(owner.address)).to.equal(fee);
            });
        });
    });
});

const getTxFees = (...receipts: ContractReceipt[]) => receipts.map(r => r.gasUsed.mul(r.effectiveGasPrice)).reduce((a, b) => a.add(b));
const getTxValues = (...txs: TransactionResponse[]) => txs.map(r => r.value).reduce((a, b) => a.add(b));
