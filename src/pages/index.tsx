import { useEffect } from "react";
import { useRouter } from "next/router";

/*************  ✨ Codeium Command ⭐  *************/
/**
 * A functional component that redirects the user to the /register page
 * immediately after the component is mounted. The component itself
 * does not render any visible content.
 */

/******  1f81040f-9106-4ceb-880b-4878b691a703  *******/
const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect ke /landingpage
    router.push("/landingpage");
  }, [router]);

  return null; // Halaman ini tidak menampilkan apa-apa
};

export default IndexPage;
