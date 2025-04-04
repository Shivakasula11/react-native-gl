import { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import { getConfigValue } from './AppConfigService';

export const useWasabiS3 = () => {
  const [s3, setS3] = useState(null);

  useEffect(() => {
    const initS3 = async () => {
      const s3Instance = new AWS.S3({
        accessKeyId: getConfigValue("WASABI_ACCESS_KEY_ID"),//wasabiKeys.WASABI_ACCESS_KEY_ID,
        secretAccessKey: getConfigValue("WASABI_SECRET_ACCESS_KEY"),//wasabiKeys.WASABI_SECRET_ACCESS_KEY,
        region: getConfigValue("WASABI_REGION"),
        endpoint: getConfigValue("WASABI_BASE_PATH"),//'https://s3.wasabisys.com',
        s3ForcePathStyle: true,
      });

      setS3(s3Instance);
    };
    initS3();
  }, []);

  return s3;
};