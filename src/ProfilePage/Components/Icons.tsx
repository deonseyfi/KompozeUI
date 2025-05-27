export const getCoinIcon = (coin: string): string => {
    try {
      // Dynamically import the icon based on the coin string
      return require(`cryptocurrency-icons/svg/color/${coin.toLowerCase()}.svg`);
    } catch (error) {
      console.error(`Icon for coin "${coin}" not found.`);
      // Return a default icon or placeholder if the coin icon is not found
      return require('cryptocurrency-icons/svg/color/generic.svg');
    }
  };