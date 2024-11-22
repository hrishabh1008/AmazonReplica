import React, { useContext } from 'react';
import { LoginContext } from '../context/ContextProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Option = ({ deletedata, get }) => {
  const { account, setAccount } = useContext(LoginContext);

  const removedata = async (id) => {
    try {
      const res = await fetch(`https://isells-server.vercel.app/remove/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await res.json();

      if (res.status >= 400 || !data) {
        console.log('Error: Unable to delete item', data);
        toast.error(`Error: Unable to delete item - ${data.error || 'Unknown error'}`, { position: 'top-right' });
      } else {
        setAccount(data);
        toast.success('Item removed successfully', { position: 'top-right' });
        get();
      }
    } catch (error) {
      console.log('Error:', error);
      toast.error('Error: Unable to delete item', { position: 'top-right' });
    }
  };

  return (
    <div className="add_remove_select">
      <p style={{ cursor: 'pointer' }} onClick={() => removedata(deletedata)}>Remove</p>
      <ToastContainer />
    </div>
  );
};

export default Option;
