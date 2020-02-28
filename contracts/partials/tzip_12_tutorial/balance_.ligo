#include "action.ligo"
#include "get_with_default_nat.ligo"
#include "default_balance.ligo"
#include "balance_param.ligo"

function balance_ (
    const balance_param : balance_param; 
    const storage : storage
    ) : (list(operation) * storage)
    is block {

        function balance_request_iterator (const balance_request : balance_request) : balance_response
            is block {
                const token_balance : token_balance = get_with_default_nat(
                    storage[balance_request.owner], 
                    default_balance
                );
            } with record 
                request = balance_request;
                balance = token_balance
            end;

        const balance_callback_param : balance_callback_param = list_map(
            balance_request_iterator, 
            balance_param.requests
        );

        const balance_response_operation : operation = transaction(
            balance_callback_param,
            0mutez,
            balance_param.callback
        );
        
        const operations : list(operation) = list
            balance_response_operation
        end;

        skip;
    } with (operations, storage)