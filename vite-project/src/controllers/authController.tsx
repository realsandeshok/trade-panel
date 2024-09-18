import {UserSignup, UserLogin } from '@/api/routes';
  

export async function Login(email: string, password: string) {
    try {
        const response = await fetch(UserLogin, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            // Handle success
            console.log('Login successful', data);
            
            if (data.token) {
                localStorage.setItem('token', data.token);
                // localStorage.setItem('token', JSON.stringify({ token: data.token, expirationTime: new Date().getTime() +  10000 }));
                

                console.log('Token stored in localStorage');
            }

            // Navigate to the home page
            window.location.href = "/portfolio";
        } else {
            // Handle error
            console.error('Login failed:', data);
            return data;
        }
    } catch (error) {
        // Handle network errors
        console.error('Network error:', error);
    }
}

export async function Signup(email: string, password: string) {
    try {
        const response = await fetch(UserSignup, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            // Handle success
            console.log('Registration successful', data);
            
            // Automatically login the user after successful signup
            await Login(email, password);

            

        } else {
            // Handle error
            console.error('Signup failed:', data);
            alert(data.message);
            return data;

        }
    } catch (error) {
        // Handle network errors
        console.error('Network error:', error);
    }
}
