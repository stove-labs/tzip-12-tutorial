#include "../tzip_12_tutorial/balance_of_param.ligo"

type request_balance_param is record
    at : address;
    balance_requests : list_of_balance_requests;
end;
type receive_balance_param is list_of_balance_responses;

type balance_requester_action is
    | Request_balance of request_balance_param
    | Receive_balance of receive_balance_param;