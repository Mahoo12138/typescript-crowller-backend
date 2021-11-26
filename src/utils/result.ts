interface Result {
  success: boolean;
  errMsg?: string;
  data: any;
}

export const getResponseData = (data: any, err?: string): Result => {
  if (err) {
    return {
      success: false,
      errMsg: err,
      data,
    };
  } else {
    return {
      success: true,
      data,
    };
  }
};
