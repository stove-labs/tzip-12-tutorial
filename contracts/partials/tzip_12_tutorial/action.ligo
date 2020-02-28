#include "transfer_param.ligo"
#include "balance_param.ligo"

type action is
(* Our simplified implementation only supports the Transfer entrypoint *)
| Transfer of transfer_param
| Balance of balance_param

(* This is just a placeholder *)
| U