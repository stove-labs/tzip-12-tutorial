#include "action.ligo"
#include "storage.ligo"
#include "../tzip_12_tutorial/balance_param.ligo"

const current_contract : address = self_address;

function request_balance (
        const request_balance_param : request_balance_param; 
        const storage : balance_requester_storage
    ) : (list(operation) * balance_requester_storage)
    is begin
        const token_contract_balance_entrypoint : contract(balance_param) = get_entrypoint(
            "%balance", 
            request_balance_param.at
        );

        const balance_operation_param : balance_param = record
            requests = request_balance_param.requests;
            callback = (get_entrypoint("%receive_balance", current_contract) : balance_callback_contract);
        end;

        const balance_operation : operation = transaction(
            balance_operation_param,
            0mutez,
            token_contract_balance_entrypoint
        );
        
        const operations : list(operation) = list
            balance_operation
        end;

        skip;
    end with (operations, storage);
    