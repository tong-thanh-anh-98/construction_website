import React from 'react'

const Notate = ({ text = 'HIỆN CHƯA CÓ DỮ LIỆU.' }) => {
    return (
        <div className='text-center py-5'>{text}</div>
    )
}

export default Notate