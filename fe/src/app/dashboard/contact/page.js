"use client";

import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faTrash, faTimes, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import styles from "./contact.module.scss";

const initialContacts = [
    { id: 1, name: "Nguyễn Văn A", role: "Trưởng phòng", department: "Kinh doanh", phone: "0901234567", type: "employee" },
    { id: 2, name: "Trần Thị B", role: "Nhân viên", department: "Marketing", phone: "0912345678", type: "employee" },
    { id: 3, name: "Lê Văn C", role: "Giám đốc", department: "Đối tác", phone: "0987654321", type: "customer" },
];

const mockInternalStaff = [
    { id: 4, name: "Phạm Văn D", role: "Kế toán trưởng", department: "Kế toán", phone: "0923456789", type: "employee" },
    { id: 5, name: "Hoàng Thị E", role: "Nhân sự", department: "Hành chính", phone: "0934567890", type: "employee" },
    { id: 6, name: "Ngô Văn F", role: "Lập trình viên", department: "Công nghệ", phone: "0945678901", type: "employee" },
];

export default function ContactPage() {
    const [contacts, setContacts] = useState(initialContacts);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [addTab, setAddTab] = useState('internal'); // 'internal' or 'external'

    // External contact form state
    const [extName, setExtName] = useState('');
    const [extRole, setExtRole] = useState('');
    const [extDepartment, setExtDepartment] = useState('');
    const [extPhone, setExtPhone] = useState('');

    const filteredContacts = useMemo(() => {
        return contacts.filter(contact => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = contact.name.toLowerCase().includes(searchLower) || 
                                  contact.phone.includes(searchQuery);
            const matchesFilter = filterType === 'all' || contact.type === filterType;
            return matchesSearch && matchesFilter;
        });
    }, [contacts, searchQuery, filterType]);

    const handleRemoveContact = (id) => {
        if(window.confirm("Bạn có chắc muốn gỡ người này khỏi danh bạ?")) {
            setContacts(contacts.filter(c => c.id !== id));
        }
    };

    const handleAddInternal = (staff) => {
        if (!contacts.find(c => c.id === staff.id)) {
            setContacts([...contacts, staff]);
            window.alert(`Đã thêm ${staff.name} vào danh bạ.`);
        } else {
            window.alert(`${staff.name} đã có trong danh bạ!`);
        }
    };

    const handleAddExternal = (e) => {
        e.preventDefault();
        if (!extName || !extPhone) {
            window.alert("Vui lòng nhập tên và số điện thoại.");
            return;
        }
        const newContact = {
            id: Date.now(),
            name: extName,
            role: extRole || "Khách hàng",
            department: extDepartment || "Đối tác ngoài",
            phone: extPhone,
            type: 'customer'
        };
        setContacts([...contacts, newContact]);
        setExtName('');
        setExtRole('');
        setExtDepartment('');
        setExtPhone('');
        setShowModal(false);
        window.alert(`Đã thêm ${newContact.name} vào danh bạ.`);
    };

    return (
        <main className={styles["contact-page"]}>
            <div className={styles["contact-page__header"]}>
                <h1 className={styles["title"]}>Danh bạ liên hệ</h1>
            </div>

            <div className={styles["contact-page__toolbar"]}>
                <div className={styles["search-box"]}>
                    <FontAwesomeIcon icon={faSearch} color="#888" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo tên, số điện thoại..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={styles["filter-box"]}>
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="all">Tất cả liên hệ</option>
                        <option value="employee">Nội bộ (Nhân viên)</option>
                        <option value="customer">Bên ngoài (Khách hàng)</option>
                    </select>
                </div>

                <button className={styles["add-btn"]} onClick={() => setShowModal(true)}>
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Thêm liên hệ</span>
                </button>
            </div>

            <div className={styles["contact-page__content"]}>
                <div className={styles["table-responsive"]}>
                    <table className={styles["contact-page__table"]}>
                        <thead>
                            <tr>
                                <th>Họ và tên</th>
                                <th>Chức vụ</th>
                                <th>Phòng ban / Công ty</th>
                                <th>Số điện thoại</th>
                                <th>Phân loại</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContacts.length > 0 ? (
                                filteredContacts.map(contact => (
                                    <tr key={contact.id}>
                                        <td><strong>{contact.name}</strong></td>
                                        <td>{contact.role}</td>
                                        <td>{contact.department}</td>
                                        <td>{contact.phone}</td>
                                        <td>
                                            <span className={`${styles["contact-type"]} ${styles[`contact-type--${contact.type}`]}`}>
                                                {contact.type === 'employee' ? 'Nhân viên' : 'Khách hàng'}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className={styles["action-btn"]} 
                                                onClick={() => handleRemoveContact(contact.id)}
                                                title="Gỡ khỏi danh bạ"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{textAlign: 'center', padding: '3rem', color: '#888'}}>
                                        Không tìm thấy liên hệ nào phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Add Contact */}
            {showModal && (
                <div className={styles["contact-page__modal-overlay"]}>
                    <div className={styles["contact-page__modal"]}>
                        <div className={styles["contact-page__modal-header"]}>
                            <h2>Thêm liên hệ mới</h2>
                            <button className={styles["close-btn"]} onClick={() => setShowModal(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className={styles["contact-page__modal-body"]}>
                            <div className={styles["contact-page__modal-tabs"]}>
                                <button 
                                    className={addTab === 'internal' ? styles["active"] : ''} 
                                    onClick={() => setAddTab('internal')}
                                >
                                    Nhân sự nội bộ
                                </button>
                                <button 
                                    className={addTab === 'external' ? styles["active"] : ''} 
                                    onClick={() => setAddTab('external')}
                                >
                                    Thêm người bên ngoài
                                </button>
                            </div>

                            {addTab === 'internal' && (
                                <div className={styles["internal-list"]}>
                                    {mockInternalStaff.map(staff => {
                                        const isAdded = contacts.find(c => c.id === staff.id);
                                        return (
                                            <div className={styles["internal-list__item"]} key={staff.id}>
                                                <div className={styles["info"]}>
                                                    <span className={styles["name"]}>{staff.name}</span>
                                                    <span className={styles["dept"]}>{staff.role} - {staff.department}</span>
                                                    <span className={styles["phone"]}><FontAwesomeIcon icon={faSearch} style={{display:'none'}}/> {staff.phone}</span>
                                                </div>
                                                <button 
                                                    className={styles["add-internal-btn"]}
                                                    onClick={() => handleAddInternal(staff)}
                                                    disabled={isAdded}
                                                    style={{ opacity: isAdded ? 0.6 : 1, cursor: isAdded ? 'not-allowed' : 'pointer' }}
                                                >
                                                    {isAdded ? 'Đã thêm' : <><FontAwesomeIcon icon={faUserPlus}/> Thêm</>}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {addTab === 'external' && (
                                <form className={styles["external-form"]} onSubmit={handleAddExternal}>
                                    <div className={styles["form-group"]}>
                                        <label>Họ và tên *</label>
                                        <input 
                                            type="text" 
                                            value={extName} 
                                            onChange={(e) => setExtName(e.target.value)} 
                                            required
                                            placeholder="Nhập họ và tên..."
                                        />
                                    </div>
                                    <div className={styles["form-group"]}>
                                        <label>Số điện thoại *</label>
                                        <input 
                                            type="text" 
                                            value={extPhone} 
                                            onChange={(e) => setExtPhone(e.target.value)} 
                                            required
                                            placeholder="Nhập số điện thoại..."
                                        />
                                    </div>
                                    <div className={styles["form-group"]}>
                                        <label>Chức vụ</label>
                                        <input 
                                            type="text" 
                                            value={extRole} 
                                            onChange={(e) => setExtRole(e.target.value)} 
                                            placeholder="Ví dụ: Giám đốc, Quản lý..."
                                        />
                                    </div>
                                    <div className={styles["form-group"]}>
                                        <label>Đơn vị / Công ty</label>
                                        <input 
                                            type="text" 
                                            value={extDepartment} 
                                            onChange={(e) => setExtDepartment(e.target.value)} 
                                            placeholder="Nhập tên công ty hoặc phòng ban..."
                                        />
                                    </div>
                                    <button type="submit" className={styles["submit-btn"]}>Lưu liên hệ</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}