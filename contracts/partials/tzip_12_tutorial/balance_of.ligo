#include "action.ligo"
#include "get_with_default_nat.ligo"
#include "default_balance.ligo"
#include "balance_of_param.ligo"

function balance_of (
    const balance_of_param : balance_of_param; 
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

        const balance_view_param : balance_view_param = list_map(
            balance_request_iterator, 
            balance_of_param.balance_requests
        );

        const balance_of_response_operation : operation = transaction(
            balance_view_param,
            0mutez,
            balance_of_param.balance_view
        );
        
        const operations : list(operation) = list
            balance_of_response_operation
        end;

        skip;
    } with (operations, storage)