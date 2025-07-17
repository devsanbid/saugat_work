import React from 'react';
import SellerApprovalCheck from './SellerApprovalCheck';

const withSellerApproval = (WrappedComponent) => {
  const WithSellerApprovalComponent = (props) => {
    return (
      <SellerApprovalCheck>
        <WrappedComponent {...props} />
      </SellerApprovalCheck>
    );
  };

  WithSellerApprovalComponent.displayName = `withSellerApproval(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithSellerApprovalComponent;
};

export default withSellerApproval;