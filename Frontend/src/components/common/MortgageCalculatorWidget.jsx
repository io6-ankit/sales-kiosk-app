import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Box, Button } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';

export const MortgageCalculatorWidget = ({ price = 200000 }) => {
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [tenureYears, setTenureYears] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [monthlyEmi, setMonthlyEmi] = useState(null);

  const calculateEmi = () => {
    const loanAmount = price - (price * downPaymentPct) / 100;
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenureYears * 12;

    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    setMonthlyEmi(Math.round(emi));
  };

  return (
    <Card variant="outlined" sx={{ mt: 4, borderRadius: 2, backgroundColor: '#fafafa' }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalculateIcon color="primary" /> Executive Sales EMI Estimator
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Down Payment %"
            type="number"
            size="small"
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
          />
          <TextField
            label="Tenure (Years)"
            type="number"
            size="small"
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
          />
          <TextField
            label="Interest Rate %"
            type="number"
            size="small"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
          />
          <Button variant="outlined" onClick={calculateEmi}>
            Estimate
          </Button>
        </Box>
        {monthlyEmi !== null && (
          <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mt: 2 }}>
            Estimated Monthly EMI: ${monthlyEmi.toLocaleString()} / month
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};