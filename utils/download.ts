import { message } from 'antd';

export const downloadBlobFile = (
  blobData: BufferSource | Blob | string,
  config: {
    fileName?: string;
    contentType?: string;
  } = {},
): void => {
  const domLink = document.createElement('a');
  domLink.download = config.fileName || 'file';
  domLink.style.display = 'none';
  const blob = new Blob([blobData], { type: config.contentType || 'application/octet-stream' });
  domLink.target = '_blank';
  domLink.href = URL.createObjectURL(blob);
  document.body.appendChild(domLink);
  domLink.click();
  document.body.removeChild(domLink);
};

export const downloadHandle = async (
  fetchFun: (...args: any) => Promise<any>,
  ext = '.xlsx',
  fileName: string = document.title,
) => {
  const response = await fetchFun();
  let blobData: Blob;
  let downloadFileName = fileName;
  if (response instanceof Blob) {
    blobData = response;
  } else {
    const disposition = response.headers.get('content-disposition');
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        downloadFileName = decodeURIComponent(matches[1].replace(/['"]/g, ''));
      }
    }
    blobData = await response.clone().blob();
  }

  if ((blobData as unknown as Blob).size === 0) {
    message.error('下载数据为空');
    return;
  }

  downloadBlobFile(blobData as unknown as string, {
    fileName: downloadFileName + ext,
    contentType: 'application/octet-stream',
  });
};
