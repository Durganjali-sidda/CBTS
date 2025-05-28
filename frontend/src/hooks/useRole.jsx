import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function useRole(requiredRole) {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== requiredRole) {
      navigate('/login');
    }
  }, [navigate, requiredRole]);
}

export default useRole;
