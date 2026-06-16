The goal is to add a button next to the "Estimate cost" button on the profile edit modal. This button will be for transferring a profile to a new address.

Requirements:
1.  **Add a "Transfer..." button**
    - Place it on the same line as the "Estimate cost" button.
    - Initially greyed out (disabled).
    - Enable it only when the handle has been validated as "Yours" (i.e. `S.handleCheck && S.handleCheck.ok && found.addr === S.addr`).
2.  **Add a "Transfer Profile" Dialog**
    - Provide an input field for the target address.
    - An initial "Next" / "Transfer" button to proceed.
    - A secondary confirmation prompt ("Are you sure you want to transfer this handle to the following address. you will lose all control of it....").
    - "Yes" to confirm transfer.
3.  **Execute Transfer**
    - The transfer creates a `PRO` update transaction signed by the current owner (done by normal PRO transaction broadcasting but with updated data).
    - In the PRO JSON, replace `pj.cre=['0']` with `pj.cre=[<new_address>]` (or similar). Wait, the prompt says "it will place the new address that was provided in the creators element of the PRO transaction. and include the new address as a keyword so the new PRO address is also notified of the transfer."
    - We need to modify `buildProOutputs` to accept an optional `transferAddr` and update `pj.cre` and `rset.add(transferAddr)`.

**Steps to implement:**
1.  **Update HTML (Modal & Edit Profile form):**
    - In `index.html`, find the `Estimate cost` button row and add a `Transfer...` button (`id="peTransferBtn"`, `disabled="true"`).
    - Add a modal (`id="modalTransferProfile"`) with input for `Target Address` and buttons `Cancel` and `Next`. Also, an area for the warning message and final `Confirm` button.
2.  **Update `checkProfileHandle` in JS:**
    - Enable the `Transfer...` button if the handle check result says "Yours" (`found.addr===S.addr`).
    - Specifically, update the `if` branches in `checkProfileHandle`:
        - `if(!found?.addr)` -> Available -> disable transfer
        - `else if(found.addr===S.addr)` -> Yours -> enable transfer
        - `else` -> Taken -> disable transfer
3.  **Add JS logic for Transfer Dialog:**
    - `function showTransferDialog()`
    - `function handleTransferNext()`: show warning.
    - `function confirmTransfer()`:
        - call `buildProTxPlan` but need a way to pass `transferAddr`.
        - Let's modify `buildProTxPlan` to accept `transferAddr` as an argument.
4.  **Modify `buildProTxPlan` and `buildProOutputs`:**
    - Add `transferAddr` to their signatures.
    - In `buildProOutputs`, if `transferAddr` is provided:
        - `pj.cre=[transferAddr];` instead of `['0']`.
        - `rset.add(transferAddr);`
5.  **Broadcast Transfer Transaction:**
    - Similar to `broadcastProfileTx`, but call `buildProTxPlan(transferAddr)`.
    - Once broadcast successfully, show status.

Let's check `pj.cre`. The normal code does `pj.cre=['0'];`.
If `transferAddr` is provided, `pj.cre=[transferAddr];`.

Let's test this plan.
