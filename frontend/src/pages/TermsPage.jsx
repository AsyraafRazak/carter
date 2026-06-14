import PageHeader from '../components/PageHeader.jsx';

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms and Conditions" eyebrow="Voucher rules">
        Users should be able to view voucher terms before redeeming.
      </PageHeader>
      <section className="summary-panel readable">
        <h2>Standard Carter Bank Voucher Terms</h2>
        <p>Vouchers are issued after successful points redemption and are subject to partner availability.</p>
        <p>Each coupon code is unique. Codes cannot be reused, exchanged for cash, or transferred after redemption.</p>
        <p>Expired vouchers and vouchers that have reached their redemption limit cannot be redeemed.</p>
        <p>Carter Bank may verify vouchers using the QR code and coupon code shown in the downloaded PDF.</p>
      </section>
    </>
  );
}
