import React, { useEffect, useState } from "react";
import SearchWalletView from "./view";
import { inject } from "types";
import { SearchWalletUIProvider } from "./search-wallet-ui-context";
import { LeaderboardClient } from "../../clients/LeaderboardClient";
import { useSelector } from "react-redux";
import { LeaderboardAppState } from "../../common/LeaderboardAppState";
import { formatData } from "../../utils/Formatter";
import { LeaderboardData } from "../../types/LeaderboardTypes";
import axios from "axios";
const SearchWalletPage = () => {
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardData[] | []
  >([]);
  const [loadingData, setLoadingData] = useState(true);
  const initialized = useSelector<LeaderboardAppState, boolean>(
    (state) => state.data.init.initialized
  );
  useEffect(() => {
    if (initialized) {
      const client = inject<LeaderboardClient>(LeaderboardClient);
      client.getLeaderboardPaginatedList().then((response) => {
        const result = response;

        axios
          .get(
            "https://api.coingecko.com/api/v3/simple/price?ids=frmx-token%2Cferrum-network&vs_currencies=USD"
          )
          .then((response) => {
            console.log(response);
            const formatedData = formatData(
              result,
              response.data["ferrum-network"].usd,
              response.data["frmx-token"].usd
            );

            setLeaderboardData([...formatedData]);
            setLoadingData(false);
          });
      });
    }
    // eslint-disable-next-line
  }, [initialized]);

  return (
    <>
      {initialized && formatData && !loadingData ? (
        <SearchWalletUIProvider leaderboardData={leaderboardData}>
          <SearchWalletView />
        </SearchWalletUIProvider>
      ) : (
        <div style={{ width: "100%", textAlign: "center", color: "white" }}>
          Loading
        </div>
      )}
    </>
  );
};

export default SearchWalletPage;
