// app/pages/auth/google/redirect.tsx
"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Console } from 'console';

const GoogleRedirect = () => {


  useEffect(() => {
    const handleGoogleRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      console.log("dsadsada: "+ code);
      if (code) {
        try {
          // Gửi mã code đến backend để lấy token
          const response = await axios.post('http://localhost:3005/auth/google/redirect');
          const { data } = response;
          console.log("dsadasdas"+response);
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
  }, []);

  return <div>Đang xử lý đăng nhập...</div>;
};

export default GoogleRedirect;
