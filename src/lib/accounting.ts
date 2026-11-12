export type AccountingPayment = { amount: number | string; kind: string; confirmation_status?: string; paid_on: string; migrated_expense_id?: string | null };
export type AccountingExpense = { amount: number | string; payer: string; reimbursement: string; paid_on: string };
export function rentalBalance(payments: AccountingPayment[], expenses: AccountingExpense[], credit: number) {
  const cash = payments.filter(p => p.kind === 'income' && (!p.confirmation_status || p.confirmation_status === 'confirmed')).reduce((s,p) => s+Number(p.amount),0);
  const landlordExpenses = expenses.filter(e=>e.payer==='landlord').reduce((s,e)=>s+Number(e.amount),0)+payments.filter(p=>p.kind==='expense' && !p.migrated_expense_id && (!p.confirmation_status || p.confirmation_status==='confirmed')).reduce((s,p)=>s+Number(p.amount),0);
  const discountedExpenses = expenses.filter(e=>e.payer==='tenant' && e.reimbursement==='rent_credit').reduce((s,e)=>s+Number(e.amount),0);
  return {cash,landlordExpenses,discountedExpenses,appliedRent:cash+credit,net:cash+credit-landlordExpenses-discountedExpenses};
}
export function chargeBalance(charge: {amount:number;credit_applied:number;due_on:string}, payments: {amount:number;confirmation_status:string}[], grace=0, today=new Date()) {
 const paid=payments.filter(p=>p.confirmation_status==='confirmed').reduce((s,p)=>s+Number(p.amount),0);
 const balance=Math.max(0,Number(charge.amount)-Number(charge.credit_applied)-paid);
 const deadline=new Date(charge.due_on+'T12:00:00'); deadline.setDate(deadline.getDate()+grace);
 return {paid,balance,status:balance<=0?'paid':today>deadline?'overdue':paid>0||charge.credit_applied>0?'partial':'pending'};
}
export const propertyLimit=(plan:string)=>plan==='pro'||plan==='premium'?1000000:plan==='basic'?5:1;
