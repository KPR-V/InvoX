//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BusinessPlans {

    struct Business {
        string name;
        string email;
        string phone;
        string registrationNumber;
    }

    struct Plan {
        string title;
        string description;
        uint price;       // Price in wei
        uint duration;   
        bool isActive;   
    }

    // Mappings
    mapping(address => Business) public businesses; 
    mapping(address => Plan[]) public plans;       

    // Array of registered business addresses
    address[] public businessAddresses;

    // Register a new business
    function registerBusiness(
        string memory _name,
        string memory _email,
        string memory _phone,
        string memory _registrationNumber
    ) public {
        require(bytes(businesses[msg.sender].name).length == 0, "Business already registered");

        // Register the business
        businesses[msg.sender] = Business({
            name: _name,
            email: _email,
            phone: _phone,
            registrationNumber: _registrationNumber
        });

        // Add the business address to the list
        businessAddresses.push(msg.sender);
    }

    function addPlan(
        string memory _title,
        string memory _description,
        uint _price,
        uint _duration
    ) public {
        require(bytes(businesses[msg.sender].name).length > 0, "Business not registered");

        plans[msg.sender].push(Plan({
            title: _title,
            description: _description,
            price: _price,
            duration: _duration,
            isActive: true
        }));
    }

    // Fetch all plans from all businesses
    function getAllPlans() public view returns (Plan[] memory) {
        uint totalPlans = 0;

        // Calculate the total number of plans
        for (uint i = 0; i < businessAddresses.length; i++) {
            totalPlans += plans[businessAddresses[i]].length;
        }

        // Create a temporary array to hold all plans
        Plan[] memory allPlans = new Plan[](totalPlans);
        uint index = 0;

        // Collect all plans
        for (uint i = 0; i < businessAddresses.length; i++) {
            address business = businessAddresses[i];
            Plan[] memory businessPlans = plans[business];

            for (uint j = 0; j < businessPlans.length; j++) {
                allPlans[index] = businessPlans[j];
                index++;
            }
        }

        return allPlans;
    }

    function deactivatePlanByTitle(string memory _title) public {
        bool found = false;
        for (uint i = 0; i < plans[msg.sender].length; i++) {
            if (keccak256(abi.encodePacked(plans[msg.sender][i].title)) == keccak256(abi.encodePacked(_title))) {
                plans[msg.sender][i].isActive = false;
                found = true;
                break;
            }
        }
        require(found, "Plan with the given title not found");
    }

    function getBusiness(address _business) public view returns (Business memory) {
        return businesses[_business];
    }
}