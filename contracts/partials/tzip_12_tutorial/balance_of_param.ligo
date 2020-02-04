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
type balance_view_param is list_of_balance_responses;
type balance_view_contract is contract(balance_view_param);
type balance_of_param is record
    balance_requests : list_of_balance_requests;
    balance_view : balance_view_contract;
end;