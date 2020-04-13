#include "storage.ligo"
#include "../tzip_12_tutorial/balance_of_param.ligo"

const current_contract : address = self_address;

function request_balance (
        const request_balance_of_param : request_balance_of_param; 
        const storage : balance_requester_storage
    ) : (list(operation) * balance_requester_storage)
    is begin
        (* Get the TZIP-12 contract instance 'from' the chain *)
        const token_contract_balance_entrypoint : contract(balance_of_param) = get_entrypoint(
            // which entrypoint we want to call
            "%balance_of", 
            // at which contract address this entrypoint can be found
            request_balance_of_param.at
        );

        (* Callback (contract) for Balance_of will be the current contract's Receive_balance entrypoint *)
        const balance_of_callback_contract : balance_of_callback_contract = get_entrypoint("%receive_balance", current_contract);

        (* Set up the parameter w/ data required for the Balance_of entrypoint *)
        const balance_of_operation_param : balance_of_param = record
            requests = request_balance_of_param.requests;
            callback = balance_of_callback_contract;
        end;

        (* 
            Forge an internal transaction to the TZIP-12 contract 
            parametrised by the prieviously prepared `balance_of_operation_param` 

            Note: We're sending 0mutez as part of this transaction
        *)
        const balance_of_operation : operation = transaction(
            balance_of_operation_param,
            0mutez,
            token_contract_balance_entrypoint
        );
        
        const operations : list(operation) = list
            balance_of_operation
        end;

        skip;
    end with (operations, storage);
    