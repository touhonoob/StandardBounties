const truffleAssert = require('truffle-assertions');

const StandardBounties = artifacts.require("../contracts/StandardBounties");
const HumanStandardToken = artifacts.require("../contracts/inherited/HumanStandardToken");

contract('StandardBounties', function(accounts) {
    it("[ERC20] verifies that I can accept a fulfillment", async () => {
        let standardBounties = await StandardBounties.new();
        let bountyToken = await HumanStandardToken.new(1_000_000_000, "USD穩定幣", 18, "USDT");
        await bountyToken.approve(standardBounties.address, 1_000, {from: accounts[0]});

        /*************-*************/
        /*** Business Logic Test ***/
        /*************-*************/
        truffleAssert.eventEmitted(
            // function issueAndContribute(
            //     address payable _sender,
            //     address payable [] memory _issuers,
            //     address [] memory _approvers,
            //     string memory _data,
            //     uint _deadline,
            //     address _token,
            //     uint _tokenVersion,
            //     uint _depositAmount
            // )
            await standardBounties.issueAndContribute(
                accounts[0],   // transaction sender
                [accounts[0]], // bounty issuers
                [accounts[0]], // bounty approvers
                "Qmc5gCcjYypU7y28oCALwfSvxCBskLuPKWpK4qpterKC7z", // IPFS hash to bounty details
                Math.round(new Date().getTime() / 1000) + 86400 * 7, // 一週後到期
                bountyToken.address, // contract address of USDT
                20, // ERC-"20"
                10, // 10 USDT
            ),
            'BountyIssued'
        );

        truffleAssert.eventEmitted(
            // fulfillBounty(
            //     address _sender,
            //     uint _bountyId,
            //     address payable [] memory  _fulfillers,
            //     string memory _data
            // )
            await standardBounties.fulfillBounty(
                accounts[0],  // transaction sender
                0,            // incremental bounty ID
                [accounts[1]], // bounty hunter
                "QmTkzDwWqPbnAh5YiV5VwcTLnGdwSNsNTn2aDxdXBFca7D" // IPFS hash to fullfillment details
            ),
            'BountyFulfilled'
        );

        truffleAssert.eventEmitted(
            // acceptFulfillment(
            //     address _sender,
            //     uint _bountyId,
            //     uint _fulfillmentId,
            //     uint _approverId,
            //     uint[] memory _tokenAmounts
            // )
            await standardBounties.acceptFulfillment(
                accounts[0], // transaction sender
                0,           // incremental bounty ID
                0,           // incremental fullfillment ID
                0,           // approver ID
                [10],        // token amount
                {from: accounts[0]}
            ),
            'FulfillmentAccepted'
        );
    });
});
