import Papa from 'papaparse';
import { blankUser } from './userData';
import { address } from './address';

export const parseUserCSV = (file) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            
            // THE MAGIC FIX 1: This automatically turns " Email " into "email"
            transformHeader: (header) => header.trim().toLowerCase(),
            
            complete: (results) => {
                const rawData = results.data;
                let validUsers = [];
                let errorCount = 0;

                rawData.forEach((row) => {
                    
                    // THE MAGIC FIX 2: Safely extract variables before we test them
                    const safeName = row.name ? String(row.name).trim() : "";
                    const safeEmail = row.email ? String(row.email).trim() : "";
                    const safePhone = row.phone ? String(row.phone).trim() : "";

                    // If name or email is blank after trimming, skip the row safely
                    if (!safeName || !safeEmail) {
                        errorCount++;
                        return;
                    }

                    const newUser = {
                        ...blankUser,
                        name: safeName,
                        email: safeEmail,
                        phone: safePhone,
                        billingAddress: {
                            ...address,
                            line1: row.billing_line1 ? String(row.billing_line1).trim() : "",
                            city: row.billing_city ? String(row.billing_city).trim() : ""
                        },
                        shippingAddress: {
                            ...address,
                            line1: row.shipping_line1 ? String(row.shipping_line1).trim() : "",
                            city: row.shipping_city ? String(row.shipping_city).trim() : ""
                        }
                    };
                    validUsers.push(newUser);
                });

                resolve({ validUsers, errorCount });
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};