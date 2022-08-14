export function Home() {
    return (
      <div>
        <h2 className='font-bold text-lg'>Home</h2>
        <p>The <strong>homepage</strong> doesn't have any async data to get.</p>
        <p>The <strong>about</strong> page hits an api</p>
        <p>The <strong>redirect</strong> page does a server redirect to about</p>
        <p>The <strong>sitemap</strong> page builds it's own string which is then written to the response, bypassing React.</p>
        <div className='flex gap-5 pt-10'>
          <img src="/public/react.svg" />
          <img src="/public/vite.svg" />
        </div>

      </div>
    );
  }
  