import Papa from 'papaparse';
import { blankUser } from './userData';
import { address } from './address';

export const parseUserCSV = (file) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines:true,
            complete: (results) => {
                const rawData = results.data;
                let validUsers = [];
                let errorCount = 0;

                rawData.forEach((row) => {
                    if(!row.name || row.email){
                        errorCount++;
                        return;
                    }

                    const newUser = {
                        ...blankUser,
                        name: row.name.trim(),
                        email: row.email.trim(),
                        phone: row.phone ? row.phone.trim() : "",
                        billingAddress: {
                            ...address,
                            line1: row.billing_line1 || "",
                            city: row.billing_city || ""
                        },
                        shippingAddress: {
                            ...address,
                            line1: row.shipping_line1 || "",
                            city: row.shipping_city || ""
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