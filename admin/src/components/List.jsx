import React, { useState, useEffect } from 'react'
import { styles } from '../assets/dummyadmin'
import { FiHeart, FiStar, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi'
import axios from 'axios'


const List = () => {

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    // State untuk inline edit harga
    const [editingId, setEditingId] = useState(null);
    const [newPrice, setNewPrice] = useState('');
    const [savingId, setSavingId] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const {data} = await axios.get('https://fourbite-backend.onrender.com/api/items');
                setItems(data);
            } 
            catch (err) {
                console.error('Error fetching Items:', err)
            }
            finally {
                setLoading(false)
            }
        };
        fetchItems();
    }, [])

    // DELETE ITEMS
    const handleDelete = async (itemId) => {
        if (!window.confirm('Anda yakin ingin menghapus item ini?')) return;

        try {
            await axios.delete(`https://fourbite-backend.onrender.com/api/items/${itemId}`, {
                withCredentials: true
            });
            setItems(prev => prev.filter(item => item._id !== itemId))
        } 
        catch (err) {
            console.error('Error deleting item:', err)
            alert('Gagal menghapus item.')
        }
    }

    // EDIT PRICE — start editing
    const handleEditPrice = (item) => {
        setEditingId(item._id);
        setNewPrice(String(item.price));
    }

    // SAVE NEW PRICE
    const handleSavePrice = async (itemId) => {
        const price = Number(newPrice);
        if (isNaN(price) || price < 0) {
            alert('Masukkan harga yang valid.');
            return;
        }
        setSavingId(itemId);
        try {
            await axios.patch(
                `https://fourbite-backend.onrender.com/api/items/${itemId}/price`,
                { price },
                { withCredentials: true }
            );
            setItems(prev => prev.map(i => i._id === itemId ? { ...i, price } : i));
            setEditingId(null);
        }
        catch (err) {
            console.error('Error updating price:', err);
            alert(err.response?.data?.message || 'Gagal mengupdate harga.');
        }
        finally {
            setSavingId(null);
        }
    }

    // CANCEL EDITING
    const handleCancelEdit = () => {
        setEditingId(null);
        setNewPrice('');
    }

    const renderStars = (rating) => 
    [ ...Array(5)].map((_, i) => (
        <FiStar className={`text-xl ${i < rating ? 'text-amber-400 fill-current' : 'text-amber-100/30'}`}
            key={i} />
    ))

    if(loading) {
        return (
            <div className={styles.pageWrapper.replace(/bg-gradient-to-br.*/, '').concat('flex items-center justify-center text-amber-100')}>
                Loading Menu...
            </div>
        )
    };

    return (
        <div className={styles.pageWrapper}>
            <div className=' max-w-7xl mx-auto'>
                <div className={styles.cardContainer}>
                    <h2 className={styles.title}>Kelola Item Menu</h2>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th className={styles.th}>Image</th>
                                    <th className={styles.th}>Name</th>
                                    <th className={styles.th}>Category</th>
                                    <th className={styles.th}>Price (Rp)</th>
                                    <th className={styles.th}>Rating</th>
                                    <th className={styles.th}>Hearts</th>
                                    <th className={styles.thCenter}>Delete</th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map(item => (
                                    <tr key={item._id} className={styles.tr}>
                                        <td className={styles.imgCell}>
                                            <img src={item.imageUrl} alt={item.name} 
                                                className={styles.img}/>
                                        </td>

                                        <td className={styles.nameCell}>
                                            <div className='space-y-1'>
                                                <p className={styles.nameText}>{item.name}</p>
                                                <p className={styles.descText}>{item.description}</p>
                                            </div>
                                        </td>

                                        <td className={styles.categoryCell}>{item.category}</td>

                                        {/* PRICE CELL — inline edit */}
                                        <td className={styles.priceCell}>
                                            {editingId === item._id ? (
                                                <div className='flex items-center gap-2'>
                                                    <span className='text-amber-500 text-sm'>Rp</span>
                                                    <input
                                                        type='number'
                                                        value={newPrice}
                                                        onChange={e => setNewPrice(e.target.value)}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter') handleSavePrice(item._id);
                                                            if (e.key === 'Escape') handleCancelEdit();
                                                        }}
                                                        className='w-28 bg-[#3a2b2b] border border-amber-500/40 rounded-lg px-2 py-1
                                                        text-amber-100 text-sm focus:outline-none focus:border-amber-400'
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => handleSavePrice(item._id)}
                                                        disabled={savingId === item._id}
                                                        className='text-green-400 hover:text-green-300 transition-colors'
                                                        title='Simpan'
                                                    >
                                                        <FiCheck className='text-lg' />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className='text-red-400 hover:text-red-300 transition-colors'
                                                        title='Batal'
                                                    >
                                                        <FiX className='text-lg' />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className='flex items-center gap-2 group/price'>
                                                    <span>
                                                        {Number(item.price).toLocaleString('id-ID', {
                                                            style: 'currency',
                                                            currency: 'IDR',
                                                            minimumFractionDigits: 0,
                                                        })}
                                                    </span>
                                                    <button
                                                        onClick={() => handleEditPrice(item)}
                                                        className='opacity-0 group-hover/price:opacity-100 text-amber-400 
                                                        hover:text-amber-300 transition-all'
                                                        title='Edit harga'
                                                    >
                                                        <FiEdit2 className='text-sm' />
                                                    </button>
                                                </div>
                                            )}
                                        </td>

                                        <td className={styles.ratingCell}>
                                            <div className='flex gap-1 '>{renderStars(item.rating)}</div>
                                        </td>
                                        
                                        <td className={styles.heartsCell}>
                                            <div className={styles.heartsWrapper}>
                                                <FiHeart className=' text-xl' />
                                                <span>{item.hearts}</span>
                                            </div>
                                        </td>

                                        <td className=' p-4 text-center'>
                                            <button onClick={() => handleDelete(item._id)}
                                                className={styles.deleteBtn}>
                                                    <FiTrash2 className=' text-2xl' />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {items.length === 0 && (
                        <div className={styles.emptyState}>
                            No items found in the menu
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default List
