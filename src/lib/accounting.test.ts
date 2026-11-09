import {test,expect} from 'bun:test';
import {rentalBalance,chargeBalance,propertyLimit} from './accounting';
test('30000 renta y 1500 credito no descuentan dos veces',()=>{
 const b=rentalBalance([{amount:28500,kind:'income',confirmation_status:'confirmed',paid_on:'2026-11-01'}],[{amount:1500,payer:'tenant',reimbursement:'rent_credit',paid_on:'2026-11-01'},{amount:1000,payer:'landlord',reimbursement:'none',paid_on:'2026-11-01'},{amount:1500,payer:'landlord',reimbursement:'none',paid_on:'2026-11-01'}],1500);
 expect(b).toEqual({cash:28500,landlordExpenses:2500,discountedExpenses:1500,appliedRent:30000,net:26000});
});
test('comprobante pendiente no salda un cargo',()=>expect(chargeBalance({amount:30000,credit_applied:1500,due_on:'2026-11-01'},[{amount:28500,confirmation_status:'pending'}],0,new Date('2026-10-01')).balance).toBe(28500));
test('pago confirmado parcial mantiene saldo',()=>expect(chargeBalance({amount:30000,credit_applied:1500,due_on:'2026-11-01'},[{amount:10000,confirmation_status:'confirmed'}],0,new Date('2026-10-01')).balance).toBe(18500));
test('gracia retrasa vencimiento',()=>expect(chargeBalance({amount:100,credit_applied:0,due_on:'2026-11-01'},[],3,new Date('2026-11-03')).status).toBe('pending'));
test('gratis una propiedad',()=>expect(propertyLimit('free')).toBe(1));
test('pro ilimitado',()=>expect(propertyLimit('pro')).toBe(1000000));
