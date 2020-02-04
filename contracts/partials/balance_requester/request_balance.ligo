#include "action.ligo"
#include "storage.ligo"
#include "../tzip_12_tutorial/balance_of_param.ligo"

const current_contract : address = self_address;

function request_balance (
        const request_balance_param : request_balance_param; 
        const storage : balance_requester_storage
    ) : (list(operation) * balance_requester_storage)
    is begin
        const token_contract_balance_of_entrypoint : contract(balance_of_param) = get_entrypoint(
            "%balance_of", 
            request_balance_param.at
        );

        const balance_of_operation_param : balance_of_param = record
            balance_requests = request_balance_param.balance_requests;
            balance_view = (get_entrypoint("%receive_balance", current_contract) : balance_view_contract);
        end;

        const balance_of_operation : operation = transaction(
            balance_of_operation_param,
            0mutez,
            token_contract_balance_of_entrypoint
        );
        
        const operations : list(operation) = list
            balance_of_operation
        end;

        skip;
    end with (operations, storage);
    