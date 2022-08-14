export function Home() {
    return (
      <div>
        <h2 className='font-bold text-lg'>Home</h2>
        <p>The <strong>homepage</strong> doesn't have any async data to get.</p>
        <p>The <strong>post</strong> pages hit an api</p>
        <p>The <strong>redirect</strong> page does a server redirect to a post</p>
        <p>The <strong>sitemap</strong> page builds it's own string which is then written to the response, bypassing React.</p>
        <div className='flex gap-5 pt-10'>
          <img src="/assets/images/react.svg" />
          <img src="/assets/images/vite.svg" />
        </div>

      </div>
    );
  }
  