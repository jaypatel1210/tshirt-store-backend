const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: 'cp8stx7qw8swpd6b',
  publicKey: '28dpc2h3hgb9ntcd',
  privateKey: 'e8d10a286ef483704c4368a16aba2eae',
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) res.status(500).send(err);
    else res.send(response);
  });
};

exports.processPayment = (req, res) => {
  const nonceFromTheClient = req.body.paymentMethodNonce;
  const amountFromTheClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      if (err) res.status(500).json(err);
      else res.json(result);
    }
  );
};
