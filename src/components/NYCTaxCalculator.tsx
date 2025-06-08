'use client';

import { useState, useEffect } from 'react';

const NYCTaxCalculator = () => {
    const [income, setIncome] = useState<number | ''>('');
    const [filingStatus, setFilingStatus] = useState('single');
    const [isSelfEmployed, setIsSelfEmployed] = useState(false);
    const [result, setResult] = useState<{ 
        federal: number; 
        nys: number; 
        nyc: number; 
        total: number;
        annualTakeHome: number;
        monthlyTakeHome: number;
        finalDeduction: number;
        deductionMethod: string;
    } | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [deductions, setDeductions] = useState({
        studentLoanInterest: '',
        iraContribution: '',
        charitableDonations: '',
        salt: '',
        mortgageInterest: '',
        medicalExpenses: '',
        healthInsurance: '',
        businessExpenses: '',
        homeOfficeSqft: '',
        totalSqft: '',
        monthlyRent: '',
        retirementContribution: ''
    });

    useEffect(() => {
        setResult(null);
        setShowDetails(false);
    }, [income, deductions, isSelfEmployed, filingStatus]);

    const handleDeductionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDeductions(prev => ({ ...prev, [name]: value }));
    };

    const calculateTaxes = (e: React.FormEvent) => {
        e.preventDefault();
        if (income === '' || income < 0) {
            alert("Please enter a valid income.");
            return;
        }

        const regularDeductions = (parseFloat(deductions.studentLoanInterest) || 0) +
                                  (parseFloat(deductions.iraContribution) || 0) +
                                  (parseFloat(deductions.charitableDonations) || 0) +
                                  (parseFloat(deductions.salt) || 0) +
                                  (parseFloat(deductions.mortgageInterest) || 0) +
                                  (parseFloat(deductions.medicalExpenses) || 0);

        let businessDeductions = 0;
        let homeOfficeDeduction = 0;
        let selfEmploymentTaxDeduction = 0;

        if (isSelfEmployed) {
            businessDeductions += parseFloat(deductions.healthInsurance) || 0;
            businessDeductions += parseFloat(deductions.businessExpenses) || 0;
            businessDeductions += parseFloat(deductions.retirementContribution) || 0;

            const homeOfficeSqft = parseFloat(deductions.homeOfficeSqft) || 0;
            const totalSqft = parseFloat(deductions.totalSqft) || 0;
            const monthlyRent = parseFloat(deductions.monthlyRent) || 0;

            if (totalSqft > 0 && homeOfficeSqft > 0 && monthlyRent > 0) {
                homeOfficeDeduction = (homeOfficeSqft / totalSqft) * (monthlyRent * 12);
                businessDeductions += homeOfficeDeduction;
            }
            
            // Calculate Self-Employment Tax
            const netEarnings = (income || 0) * 0.9235;
            const socialSecurityTax = Math.min(netEarnings, 160200) * 0.124;
            const medicareTax = netEarnings * 0.029;
            selfEmploymentTaxDeduction = (socialSecurityTax + medicareTax) / 2;
            businessDeductions += selfEmploymentTaxDeduction;
        }

        const businessIncome = (income || 0) - businessDeductions;
        
        // QBI Deduction (simplified)
        const qbiDeduction = isSelfEmployed ? businessIncome * 0.20 : 0;

        const standardDeductions = {
            single: 13850,
            married: 27700,
            hoh: 20800
        };
        const standardDeduction = standardDeductions[filingStatus as keyof typeof standardDeductions] || 13850;

        const itemizedDeductions = regularDeductions;
        
        let finalDeduction = standardDeduction;
        let deductionMethod = 'Standard';

        if (itemizedDeductions > standardDeduction) {
            finalDeduction = itemizedDeductions;
            deductionMethod = 'Itemized';
        }
        
        const totalDeductions = finalDeduction + businessDeductions + qbiDeduction;
        const taxableIncome = Math.max(0, (income || 0) - totalDeductions);

        const federalTax = calculateFederalTax(taxableIncome, filingStatus);
        const nysTax = calculateNysTax(taxableIncome, filingStatus);
        const nycTax = calculateNycTax(taxableIncome, filingStatus);
        const totalTax = federalTax + nysTax + nycTax;
        const annualTakeHome = (income || 0) - totalTax;
        const monthlyTakeHome = annualTakeHome / 12;

        setResult({ federal: federalTax, nys: nysTax, nyc: nycTax, total: totalTax, annualTakeHome, monthlyTakeHome, finalDeduction, deductionMethod });
    };

    const calculateFederalTax = (income: number, status: string) => {
        type BracketKey = 'single' | 'married' | 'hoh';

        // 2023 Federal Tax Brackets
        const brackets = {
            single: [
                { upto: 11000, rate: 0.10 },
                { upto: 44725, rate: 0.12 },
                { upto: 95375, rate: 0.22 },
                { upto: 182100, rate: 0.24 },
                { upto: 231250, rate: 0.32 },
                { upto: 578125, rate: 0.35 },
                { upto: Infinity, rate: 0.37 }
            ],
            married: [
                { upto: 22000, rate: 0.10 },
                { upto: 89450, rate: 0.12 },
                { upto: 190750, rate: 0.22 },
                { upto: 364200, rate: 0.24 },
                { upto: 462500, rate: 0.32 },
                { upto: 693750, rate: 0.35 },
                { upto: Infinity, rate: 0.37 }
            ],
            hoh: [
                { upto: 15700, rate: 0.10 },
                { upto: 59850, rate: 0.12 },
                { upto: 95350, rate: 0.22 },
                { upto: 182100, rate: 0.24 },
                { upto: 231250, rate: 0.32 },
                { upto: 578100, rate: 0.35 },
                { upto: Infinity, rate: 0.37 }
            ]
        };

        const selectedBrackets = brackets[status as BracketKey] || brackets.single;
        let tax = 0;
        let lastLimit = 0;

        for (const bracket of selectedBrackets) {
            if (income > bracket.upto) {
                tax += (bracket.upto - lastLimit) * bracket.rate;
                lastLimit = bracket.upto;
            } else {
                tax += (income - lastLimit) * bracket.rate;
                return tax;
            }
        }
        return tax;
    };

    const calculateNysTax = (income: number, status: string) => {
        type BracketKey = 'single' | 'married' | 'hoh';
        // 2023 NYS Tax Brackets - Simplified
        const brackets = {
            single: [
                { upto: 8500, rate: 0.04 },
                { upto: 11700, rate: 0.045 },
                { upto: 13900, rate: 0.0525 },
                { upto: 80650, rate: 0.055 },
                { upto: 215400, rate: 0.06 },
                { upto: 1077550, rate: 0.0685 },
                { upto: Infinity, rate: 0.109 }
            ],
            married: [
                { upto: 17150, rate: 0.04 },
                { upto: 23600, rate: 0.045 },
                { upto: 27900, rate: 0.0525 },
                { upto: 161550, rate: 0.055 },
                { upto: 323200, rate: 0.06 },
                { upto: 2155350, rate: 0.0685 },
                { upto: Infinity, rate: 0.109 }
            ],
            hoh: [
                { upto: 12800, rate: 0.04 },
                { upto: 17650, rate: 0.045 },
                { upto: 20900, rate: 0.0525 },
                { upto: 107650, rate: 0.055 },
                { upto: 269300, rate: 0.06 },
                { upto: 1616450, rate: 0.0685 },
                { upto: Infinity, rate: 0.109 }
            ]
        };

        const selectedBrackets = brackets[status as BracketKey] || brackets.single;
        let tax = 0;
        let lastLimit = 0;

        for (const bracket of selectedBrackets) {
            if (income > bracket.upto) {
                tax += (bracket.upto - lastLimit) * bracket.rate;
                lastLimit = bracket.upto;
            } else {
                tax += (income - lastLimit) * bracket.rate;
                return tax;
            }
        }
        return tax;
    };

    const calculateNycTax = (income: number, status: string) => {
        type BracketKey = 'single' | 'married' | 'hoh';
        // 2023 NYC Tax Brackets - Simplified
        const brackets = {
            single: [
                { upto: 12000, rate: 0.03078 },
                { upto: 25000, rate: 0.03762 },
                { upto: 50000, rate: 0.03819 },
                { upto: Infinity, rate: 0.03876 }
            ],
            married: [
                { upto: 21600, rate: 0.03078 },
                { upto: 45000, rate: 0.03762 },
                { upto: 90000, rate: 0.03819 },
                { upto: Infinity, rate: 0.03876 }
            ],
            hoh: [
                { upto: 14400, rate: 0.03078 },
                { upto: 30000, rate: 0.03762 },
                { upto: 60000, rate: 0.03819 },
                { upto: Infinity, rate: 0.03876 }
            ]
        };

        const selectedBrackets = brackets[status as BracketKey] || brackets.single;
        let tax = 0;
        let lastLimit = 0;

        for (const bracket of selectedBrackets) {
            if (income > bracket.upto) {
                tax += (bracket.upto - lastLimit) * bracket.rate;
                lastLimit = bracket.upto;
            } else {
                tax += (income - lastLimit) * bracket.rate;
                return tax;
            }
        }
        return tax;
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-white mb-8">NYC Income Tax Calculator</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Inputs */}
                <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20">
                    <form onSubmit={calculateTaxes}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label htmlFor="income" className="block text-gray-300 mb-2">Annual Income:</label>
                                <input
                                    type="number"
                                    id="income"
                                    value={income}
                                    onChange={(e) => setIncome(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                    placeholder="Enter your annual income"
                                    required
                                    className="w-full px-3 py-2 border rounded-md bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-lavender-bright"
                                />
                            </div>
                            <div>
                                <label htmlFor="filingStatus" className="block text-gray-300 mb-2">Filing Status:</label>
                                <select
                                    id="filingStatus"
                                    value={filingStatus}
                                    onChange={(e) => setFilingStatus(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-lavender-bright"
                                >
                                    <option value="single">Single</option>
                                    <option value="married">Married Filing Jointly</option>
                                    <option value="hoh">Head of Household</option>
                                </select>
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold text-white mt-6 mb-4">Itemizable Deductions</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-1">Student Loan Interest</label>
                                <input type="number" name="studentLoanInterest" value={deductions.studentLoanInterest} onChange={handleDeductionChange} placeholder="e.g., 2500" className="w-full px-3 py-2 border rounded-md bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-lavender-bright" />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">IRA Contribution</label>
                                <input type="number" name="iraContribution" value={deductions.iraContribution} onChange={handleDeductionChange} placeholder="e.g., 6000" className="w-full px-3 py-2 border rounded-md bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-lavender-bright" />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">Charitable Donations</label>
                                <input type="number" name="charitableDonations" value={deductions.charitableDonations} onChange={handleDeductionChange} placeholder="e.g., 500" className="w-full px-3 py-2 border rounded-md bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-lavender-bright" />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">State and Local Taxes (SALT)</label>
                                <input type="number" name="salt" value={deductions.salt} onChange={handleDeductionChange} placeholder="Max $10,000" className="w-full px-3 py-2 border rounded-md bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-lavender-bright" />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">Mortgage Interest</label>
                                <input type="number" name="mortgageInterest" value={deductions.mortgageInterest} onChange={handleDeductionChange} placeholder="e.g., 12000" className="w-full px-3 py-2 border rounded-md bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-lavender-bright" />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">Medical Expenses</label>
                                <input type="number" name="medicalExpenses" value={deductions.medicalExpenses} onChange={handleDeductionChange} placeholder="e.g., 3000" className="w-full px-3 py-2 border rounded-md bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-lavender-bright" />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="flex items-center text-gray-300">
                                <input type="checkbox" checked={isSelfEmployed} onChange={(e) => setIsSelfEmployed(e.target.checked)} className="mr-2 h-4 w-4 bg-white/20 border-white/30 rounded text-lavender-bright focus:ring-lavender-bright" />
                                I am self-employed
                            </label>
                        </div>

                        {isSelfEmployed && (
                            <div className="mt-4 pl-4 border-l-2 border-white/20 space-y-4">
                                <h3 className="text-lg font-semibold text-white mb-2">Self-Employment Deductions</h3>
                                <div>
                                    <label className="block text-gray-300 mb-1">Health Insurance Premiums</label>
                                    <input type="number" name="healthInsurance" value={deductions.healthInsurance} onChange={handleDeductionChange} placeholder="e.g., 5000" className="w-full px-3 py-2 border rounded-md bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-lavender-bright" />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-1">Retirement Contributions (SEP, SIMPLE, solo 401k)</label>
                                    <input type="number" name="retirementContribution" value={deductions.retirementContribution} onChange={handleDeductionChange} placeholder="e.g., 15000" className="w-full px-3 py-2 border rounded-md bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-lavender-bright" />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-1">Business Expenses</label>
                                    <input type="number" name="businessExpenses" value={deductions.businessExpenses} onChange={handleDeductionChange} placeholder="e.g., 10000" className="w-full px-3 py-2 border rounded-md bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-lavender-bright" />
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <h4 className="text-md font-semibold text-white mb-2">Home Office Deduction</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Office SqFt</label>
                                            <input type="number" name="homeOfficeSqft" value={deductions.homeOfficeSqft} onChange={handleDeductionChange} placeholder="e.g., 150" className="w-full px-2 py-1 border rounded-md bg-white/10 text-white border-white/20 focus:outline-none focus:ring-1 focus:ring-lavender-bright" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Total SqFt</label>
                                            <input type="number" name="totalSqft" value={deductions.totalSqft} onChange={handleDeductionChange} placeholder="e.g., 750" className="w-full px-2 py-1 border rounded-md bg-white/10 text-white border-white/20 focus:outline-none focus:ring-1 focus:ring-lavender-bright" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Monthly Rent</label>
                                            <input type="number" name="monthlyRent" value={deductions.monthlyRent} onChange={handleDeductionChange} placeholder="e.g., 3000" className="w-full px-2 py-1 border rounded-md bg-white/10 text-white border-white/20 focus:outline-none focus:ring-1 focus:ring-lavender-bright" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="w-full mt-6 bg-lavender-bright/80 text-white font-bold py-2 px-4 rounded-md hover:bg-lavender-bright focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-lavender-bright transition-all">
                            Calculate
                        </button>
                    </form>
                </div>

                {/* Right Column: Results */}
                <div className="sticky top-24">
                    <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20">
                        <h2 className="text-2xl font-bold text-center text-white mb-4">Results</h2>
                        {result ? (
                            <>
                                <div className="space-y-2 text-gray-200">
                                    <p className="flex justify-between"><span>Total Estimated Tax:</span> <span className="font-bold">{formatCurrency(result.total)}</span></p>
                                    <p className="flex justify-between"><span>Annual Take-Home:</span> <span className="font-bold">{formatCurrency(result.annualTakeHome)}</span></p>
                                    <p className="flex justify-between"><span>Monthly Take-Home:</span> <span className="font-bold">{formatCurrency(result.monthlyTakeHome)}</span></p>
                                </div>

                                <div className="mt-4">
                                    <button type="button" onClick={() => setShowDetails(!showDetails)} className="text-lavender-bright hover:underline w-full text-left">
                                        {showDetails ? 'Hide' : 'Show'} Calculation Details
                                    </button>
                                    {showDetails && (
                                        <div className="mt-2 p-3 bg-black/20 border border-white/10 rounded-md text-sm">
                                            <p className="flex justify-between"><span>Gross Annual Income:</span> <span>{formatCurrency(income || 0)}</span></p>
                                            <p className="flex justify-between"><span>Deduction Method:</span> <span>{result.deductionMethod}</span></p>
                                            <p className="flex justify-between"><span>Total Deductions:</span> <span>-{formatCurrency(result.finalDeduction)}</span></p>
                                            {isSelfEmployed && (
                                                <>
                                                    <p className="flex justify-between pl-4"><span>&nbsp;&nbsp;- QBI Deduction:</span> <span>-{formatCurrency(((income || 0) - ((parseFloat(deductions.healthInsurance) || 0) + (parseFloat(deductions.businessExpenses) || 0))) * 0.20)}</span></p>
                                                    <p className="flex justify-between pl-4"><span>&nbsp;&nbsp;- Business Deductions:</span> <span>-{formatCurrency((parseFloat(deductions.healthInsurance) || 0) + (parseFloat(deductions.businessExpenses) || 0))}</span></p>
                                                </>
                                            )}
                                            <p className="flex justify-between border-t border-white/10 mt-1 pt-1"><span>Taxable Income:</span> <span>{formatCurrency(Math.max(0, (income || 0) - result.finalDeduction))}</span></p>
                                            <hr className="my-2 border-white/10" />
                                            <p className="flex justify-between"><span>Federal Tax:</span> <span>{formatCurrency(result.federal)}</span></p>
                                            <p className="flex justify-between"><span>NYS Tax:</span> <span>{formatCurrency(result.nys)}</span></p>
                                            <p className="flex justify-between"><span>NYC Tax:</span> <span>{formatCurrency(result.nyc)}</span></p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-400 py-16">
                                <p>Enter your financial details to see your tax estimate.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NYCTaxCalculator;
