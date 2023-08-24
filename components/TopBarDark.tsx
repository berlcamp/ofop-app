export default function TopBarDark ({ isGuest }: { isGuest?: boolean }) {
  return (
    <div className='fixed top-0 z-20 w-full'>
      <div className='p-2 flex items-center bg-gray-800'>
        <div className='flex-1'>
          <div className='font-semibold text-lg text-white'>OFOP</div>
        </div>
        <div className='flex space-x-2'>

        </div>
      </div>
    </div>
  )
}
