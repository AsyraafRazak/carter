export function voucherStatus(voucher) {
  if (!voucher?.isActive) {
    return { label: 'Inactive', severity: 'danger', redeemable: false };
  }

  if (new Date(voucher.expiryDate) < new Date()) {
    return { label: 'Expired', severity: 'danger', redeemable: false };
  }

  const remaining = Math.max((voucher.limit || 0) - (voucher.redeemedCount || 0), 0);
  if (remaining <= 0) {
    return { label: 'Fully redeemed', severity: 'warning', redeemable: false };
  }

  return { label: `${remaining} left`, severity: 'success', redeemable: true };
}

export function voucherCategoryName(voucher) {
  return voucher?.category_id?.name || 'Uncategorized';
}
