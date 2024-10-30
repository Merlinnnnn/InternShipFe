// app/pages/auth/google/redirect.tsx
"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const GoogleRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const handleGoogleRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          const response = await axios.get('http://localhost:3005/auth/google/callback');
          const { data } = response;
          
          if (data.success) {
            // Xử lý đăng nhập thành công
            alert('Đăng nhập thành công');
          } else {
            // Xử lý đăng nhập thất bại
            alert('Đăng nhập thất bại');
          }
        } catch (error) {
          console.error('Error during Google login:', error);
          alert('Đăng nhập thất bại');
        }
      } else {
        alert('Đăng nhập thất bại');
      }
    };

    handleGoogleRedirect();
  }, [router]);

  return <div>Đang xử lý đăng nhập...</div>;
};

export default GoogleRedirect;
