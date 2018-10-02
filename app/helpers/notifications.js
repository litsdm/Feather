import { ipcRenderer } from 'electron';

const notify = ({ title, ...options }) => {
  const notification = new Notification(title, options);

  notification.onClick = () => {
    ipcRenderer.send('show-window');
  }
}

export default notify;
