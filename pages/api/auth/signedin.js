import useSWR from 'swr'
import axios from 'axios'
const fetcher = url => axios.get(url).then(res => res.data);
function isLoggedIn () {
     const { data, error } = useSWR(`/api/auth`, fetcher, {
          revalidateOnMount: true,
          shouldRetryOnError: false
     });

     return {
          user: data,
          isLoading: !error && !data,
          isError: error
     }
}

export default isLoggedIn;