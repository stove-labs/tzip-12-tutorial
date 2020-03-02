#include "transfer_param.ligo"
type balance_request is record
    owner : address; 
    token_id : token_id;  
end;

type balance_response is record
  request : balance_request;
  balance : nat;
end;

type list_of_balance_responses is list(balance_response);
type list_of_balance_requests is list(balance_request);

type balance_of_callback_param is list_of_balance_responses;
type balance_of_callback_contract is contract(balance_of_callback_param);
type balance_of_param is record
    requests : list_of_balance_requests;
    callback : balance_of_callback_contract;
end;