//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DatasetRegistry {
    struct Dataset {
        address owner;
        string dataset_id;
        uint256 createdDate;
        string[] accessHistory;
    }

    mapping(string => Dataset) public datasets;

    event DatasetCreated(
        string dataset_id,
        address indexed owner,
        uint256 createdDate,
        string[] accessHistory
    );

    event AccessRequestAccepted(
        string dataset_id,
        address indexed requestor,
        string[] files,
        string timestamp
    );

    event DatasetUnshared(
        string dataset_id,
        address indexed sharedWith,
        string timestamp
    );

    event AccessRequested(
        string dataset_id,
        address indexed requestor,
        string timestamp
    );

    event AccessRequestCanceled(
        string dataset_id,
        address indexed requestor,
        string timestamp
    );

    function createDataset(
        string memory _dataset_id,
        string memory _historyEntry
    ) public {
        require(
            bytes(datasets[_dataset_id].dataset_id).length == 0,
            "Dataset ID already exists!"
        );

        uint256 currentTime = block.timestamp;
        datasets[_dataset_id] = Dataset({
            owner: msg.sender,
            dataset_id: _dataset_id,
            createdDate: currentTime,
            accessHistory: new string[](1)
        });
        datasets[_dataset_id].accessHistory[0] = _historyEntry;

        emit DatasetCreated(
            _dataset_id,
            msg.sender,
            currentTime,
            datasets[_dataset_id].accessHistory
        );
    }

    function acceptAccessRequest(
        string memory _dataset_id,
        address _requestor,
        string[] memory _files
    ) public {
        emit AccessRequestAccepted(
            _dataset_id,
            _requestor,
            _files,
            uint2str(block.timestamp)
        );
    }

    function unshareDataset(
        string memory _dataset_id,
        address _sharedWith
    ) public {
        emit DatasetUnshared(
            _dataset_id,
            _sharedWith,
            uint2str(block.timestamp)
        );
    }

    function requestAccess(
        string memory _dataset_id,
        address _requestor
    ) public {
        require(
            datasets[_dataset_id].owner != address(0),
            "Dataset does not exist!"
        );
        string memory timestamp = uint2str(block.timestamp);
        datasets[_dataset_id].accessHistory.push(
            string(
                abi.encodePacked(
                    "Access requested by ",
                    toAsciiString(_requestor),
                    " on ",
                    timestamp
                )
            )
        );
        emit AccessRequested(_dataset_id, _requestor, timestamp);
    }

    function cancelAccessRequest(
        string memory _dataset_id,
        address _requestor
    ) public {
        require(
            datasets[_dataset_id].owner != address(0),
            "Dataset does not exist!"
        );
        require(
            datasets[_dataset_id].owner == msg.sender ||
                _requestor == msg.sender,
            "Only the owner or requestor can cancel the access request"
        );

        string memory timestamp = uint2str(block.timestamp);
        datasets[_dataset_id].accessHistory.push(
            string(
                abi.encodePacked(
                    "Access request by ",
                    toAsciiString(_requestor),
                    " cancelled on ",
                    timestamp
                )
            )
        );

        emit AccessRequestCanceled(_dataset_id, _requestor, timestamp);
    }

    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length - 1;
        while (_i != 0 && k > 0) {
            bstr[k--] = bytes1(uint8(48 + (_i % 10)));
            _i /= 10;
        }
        return string(bstr);
    }

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(42);
        s[0] = "0";
        s[1] = "x";
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2 ** (8 * (19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2 * i + 2] = char(hi);
            s[2 * i + 3] = char(lo);
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    function getDatasetAccessHistory(
        string memory _dataset_id
    ) public view returns (string[] memory) {
        return datasets[_dataset_id].accessHistory;
    }
}
