#include "transfer_param.ligo"
#include "balance_of_param.ligo"

type action is
(* Our simplified implementation only supports the Transfer entrypoint *)
| Transfer of transfer_param
| Balance_of of balance_of_param

(* This is just a placeholder *)
| U