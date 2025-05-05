  export interface TransactionItems {
    stellarAddress: string;
    time: string;
    amountXML: number;
    amountUSD: number;
    fee: number;
    status: 'Completed' | 'Pending' | 'Failed';
    wallet: string;
  }
  
  export const initialTransactionItems: TransactionItems[] = [
    {
      stellarAddress: "123572777sfgf",
      time: "2025-04-28T08:25:00",
      amountXML: 245.5,
      amountUSD: 12,
      fee: 0.00001,
      status: "Completed",
      wallet: "xBull",
    },
    {
        stellarAddress: "34543bhgbh",
        time: "2025-04-28T09:25:00",
        amountXML: 50.5,
        amountUSD: 12,
        fee: 0.00001,
        status: "Completed",
        wallet: "Albedo",
      },
      {
        stellarAddress: "shbdhedbb5656",
        time: "2025-04-28T11:25:00",
        amountXML: 300.5,
        amountUSD: 12,
        fee: 0.00002,
        status: "Pending",
        wallet: "Freighter",
      },
      {
        stellarAddress: "shbdhedbb5656",
        time: "2025-04-29T14:40:00",
        amountXML: 600,
        amountUSD: 12,
        fee: 0.00034,
        status: "Failed",
        wallet: "Rabet",
      },
      {
        stellarAddress: "shbdhedbb5656",
        time: "2025-04-29T14:40:00",
        amountXML: 600,
        amountUSD: 12,
        fee: 0.00034,
        status: "Failed",
        wallet: "Freighter",
      },
      {
        stellarAddress: "shbdhedbb5656",
        time: "2025-04-29T14:40:00",
        amountXML: 600,
        amountUSD: 12,
        fee: 0.00034,
        status: "Pending",
        wallet: "Rabet",
      },
      {
        stellarAddress: "shbdhedbb5656",
        time: "2025-04-29T14:40:00",
        amountXML: 600,
        amountUSD: 12,
        fee: 0.00034,
        status: "Completed",
        wallet: "Xbull",
      },
      {
        stellarAddress: "735753fgbfgherhn",
        time: "2025-04-29T14:40:00",
        amountXML: 600,
        amountUSD: 12,
        fee: 0.00034,
        status: "Completed",
        wallet: "Albedo",
      },
      {
        stellarAddress: "dfbhdbdfb511s",
        time: "2025-04-29T14:40:00",
        amountXML: 600,
        amountUSD: 12,
        fee: 0.00034,
        status: "Failed",
        wallet: "Albedo",
      },
      {
        stellarAddress: "shbdhedbb5656",
        time: "2025-04-29T14:40:00",
        amountXML: 600,
        amountUSD: 12,
        fee: 0.00034,
        status: "Failed",
        wallet: "Xbull",
      },
      {
        stellarAddress: "hfgnfghhfg783863",
        time: "2025-05-01T14:40:00",
        amountXML: 600,
        amountUSD: 12,
        fee: 0.00034,
        status: "Failed",
        wallet: "Freighter",
      },
  ];
  
  export const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-50 text-green-600';
      case 'Pending': return 'bg-yellow-50 text-yellow-600';
      case 'Failed': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };
  
  export const getWalletColor = (wallet: string) => {
    switch (wallet.toLowerCase()) {
      case 'xbull': return '#ffb257';
      case 'freighter': return '#800788';
      case 'albedo': return '#0046c4';
      case 'rabet': return '#57b000';
      default: return '#78767c';
    }
  };
  
  