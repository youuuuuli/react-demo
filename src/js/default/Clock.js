import React, { useEffect, useState } from 'react';
import { moment } from '../utils';
import DF from '../constants/date_format.json';

const useDiffTime = (defaultTime) => {
  const [diff, setDiff] = useState(defaultTime);

  useEffect(() => {
    const getDiffTime = async () => {
      setDiff(0);
    };

    getDiffTime();
  }, []);

  return { diff };
};

/**
 * 系統時間
 *
 * @returns {JSX.Element} Clock
 */
function Clock() {
  const { diff } = useDiffTime(0);
  const [time, setTime] = useState(
    moment()
      .tz('Etc/UTC+8')
      .format(DF.datetime),
  );

  /**
   * 更新系統(美東)時間
   */
  useEffect(() => {
    const timeout = setTimeout(() => setTime(
      moment()
        .tz('Etc/UTC+8')
        .add(diff, 'second')
        .format(DF.datetime),
    ), 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [time]);

  return (
    <div className="es-time">{time}</div>
  );
}

export default Clock;
