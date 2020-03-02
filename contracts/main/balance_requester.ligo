#include "../partials/balance_requester/action.ligo"
#include "../partials/balance_requester/storage.ligo"
#include "../partials/balance_requester/request_balance.ligo"

function main (
    const action : balance_requester_action; 
    var storage : balance_requester_storage
    ) : (list(operation) * balance_requester_storage)
    is (case action of
    | Request_balance(request_balance_of_param) -> request_balance(request_balance_of_param, storage)
    | Receive_balance(receive_balance_of_param) -> ((nil : list(operation)), receive_balance_of_param)
    end)