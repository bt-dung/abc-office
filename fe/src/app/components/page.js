"use client";

import styles from './components.module.scss';
import React, {useState, useEffect, useMemo} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faTrash, faTimes, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const listComponents = [
    {
        id: 1,
        name: "Search Bar",
        link: "/components/search-bar"
    },
    {
        id: 2,
        name: "Button Primary",
        link: "/components/button-primary"
    },
    {
        id: 3,
        name: "Card Product",
        link: "/components/card-product"
    },
    {
        id: 4,
        name: "Modal Popup",
        link: "/components/modal-popup"
    },
    {
        id: 5,
        name: "Dropdown Menu",
        link: "/components/dropdown-menu"
    },
    {
        id: 6,
        name: "Carousel",
        link: "/components/carousel"
    },
    {
        id: 7,
        name: "Pagination",
        link: "/components/pagination"
    
    },
    {
        id: 8,
        name: "Accordion",
        link: "/components/accordion"
    },
    {
        id: 9,
        name: "Tabs",
        link: "/components/tabs"
    }
];

export default function ComponentPage () {
    const [components, setComponents] = useState(listComponents);
    const [searchQuery, setSearchQuery] = useState('');

    const filterComponents = useMemo(() => {
        return components.filter(component => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = component.name.toLowerCase().includes(searchLower);
            return matchesSearch;
        });
    }, [components, searchQuery]);
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.pageContainer}>
                <div className={styles.searchBar}>
                    <FontAwesomeIcon icon={faSearch} color="#ccc"/>
                    <input 
                        type="text" 
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.componentList}>
                    {filterComponents.length > 0 ? (
                        filterComponents.map(component => (
                            <div className={styles.componentItem} key={component.id}>
                                <a href={component.link} target="_blank" rel="noopener noreferrer"className={styles.componentLink}>
                                    <span className={styles.componentName}>{component.name}
                                    </span>
                                </a>
                            </div>
                        ))
                    ) : (
                        <span className={styles.noResult}>No component found</span>
                    )}         
                </div>
            </div>
        </div>
    )
};