import React, { useContext, useState } from 'react';
import { Button, Modal, Menu } from 'semantic-ui-react';
import { Cookies, useHistory } from '../utils';
import ApiContext from '../default/ApiContext';

/**
 * 登出
 */
const Logout = () => {
  const { tr } = useContext(ApiContext);
  const { forward } = useHistory();
  const [open, setOpen] = useState(false);

  const onLogout = async () => {
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });

    forward('/');
  };

  return (
    <Modal
      className="logout-page"
      size="mini"
      trigger={<Menu.Item icon="log out" onClick={() => setOpen(true)} title={tr('M_FUNC_LOGOUT')} />}
      open={open}
      onClose={() => setOpen(false)}
    >
      <Modal.Header content={tr('M_LOGOUT_NOTICE')} />
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>{tr('M_ACTION_CANCEL')}</Button>
        <Button color="red" onClick={onLogout}>{tr('M_FUNC_LOGOUT')}</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Logout;
