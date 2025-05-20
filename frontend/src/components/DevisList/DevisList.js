// src/components/DevisList/DevisList.js
import React, { useState, useMemo, useEffect } from "react";
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel,
  getFilteredRowModel,
  flexRender
} from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFilePdf, 
  faFileWord, 
  faEdit, 
  faSort, 
  faSortUp, 
  faSortDown,
  faStar,
  faShieldAlt,
  faFilter,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getDocxUrl, getPdfUrl } from "../../services/api";
import "./DevisList.css";

const DevisList = ({ data }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState({
    garantie: "",
    client_vip: "",
    date_creation_min: "",
    date_creation_max: "",
    prime_min: "",
    prime_max: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  
  // Mettre à jour les données filtrées quand les filtres ou data changent
  useEffect(() => {
    let result = [...data];
    
    // Filtre garantie
    if (filters.garantie) {
      result = result.filter(item => item.garantie === filters.garantie);
    }
    
    // Filtre VIP
    if (filters.client_vip !== "") {
      const isVip = filters.client_vip === "true";
      result = result.filter(item => item.client_vip === isVip);
    }
    
    // Filtre date minimum
    if (filters.date_creation_min) {
      const minDate = new Date(filters.date_creation_min);
      result = result.filter(item => new Date(item.date_creation) >= minDate);
    }
    
    // Filtre date maximum
    if (filters.date_creation_max) {
      const maxDate = new Date(filters.date_creation_max);
      maxDate.setHours(23, 59, 59); // Pour inclure tout le jour
      result = result.filter(item => new Date(item.date_creation) <= maxDate);
    }
    
    // Filtre prime minimum
    if (filters.prime_min) {
      const min = parseFloat(filters.prime_min);
      result = result.filter(item => (item.prime_totale || 0) >= min);
    }
    
    // Filtre prime maximum
    if (filters.prime_max) {
      const max = parseFloat(filters.prime_max);
      result = result.filter(item => (item.prime_totale || 0) <= max);
    }
    
    setFilteredData(result);
  }, [data, filters]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const resetFilters = () => {
    setFilters({
      garantie: "",
      client_vip: "",
      date_creation_min: "",
      date_creation_max: "",
      prime_min: "",
      prime_max: "",
    });
  };
  
  // Vérifier si des filtres sont actifs
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== "" && value !== null && value !== undefined
  );
  
  const columns = useMemo(
    () => [
      {
        header: "Numéro d'opportunité",
        accessorKey: "numero_opportunite",
      },
      {
        header: "Client",
        accessorKey: "nom_client",
      },
      {
        header: "Garanties",
        accessorKey: "garantie",
        cell: info => {
          const garantie = info.getValue();
          let badgeClass = "bg-secondary"; // Couleur par défaut
          
          if (garantie === "DO") {
            badgeClass = "bg-info";
          } else if (garantie === "TRC") {
            badgeClass = "bg-success";
          } else if (garantie === "DO+TRC") {
            badgeClass = "bg-primary";
          }
          
          return garantie ? (
            <span className={`badge ${badgeClass}`}>
              <FontAwesomeIcon icon={faShieldAlt} className="me-1" /> {garantie}
            </span>
          ) : (
            <span className="text-muted">Non défini</span>
          );
        }
      },
      {
        header: "Statut",
        accessorKey: "client_vip",
        cell: info => (
          info.getValue() ? (
            <span className="badge bg-warning text-dark">
              <FontAwesomeIcon icon={faStar} className="me-1" /> VIP
            </span>
          ) : (
            <span className="text-muted">Standard</span>
          )
        )
      },
      {
        header: "Primes",
        accessorKey: "prime_totale",
        cell: info => info.getValue() ? `${info.getValue().toLocaleString()} €` : "N/A"
      },
      {
        header: "Date création",
        accessorKey: "date_creation",
        cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : "N/A"
      },
      {
        header: "Actions",
        accessorKey: "id",
        enableSorting: false,
        cell: info => (
          <div className="btn-group">
            <Link 
              to={`/devis/${info.getValue()}/edit`} 
              className="btn btn-sm btn-outline-secondary"
            >
              <FontAwesomeIcon icon={faEdit} /> Modifier
            </Link>
            <a 
              href={getDocxUrl(info.getValue())} 
              className="btn btn-sm btn-outline-primary" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faFileWord} /> Word
            </a>
            <a 
              href={getPdfUrl(info.getValue())} 
              className="btn btn-sm btn-outline-danger" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faFilePdf} /> PDF
            </a>
          </div>
        )
      }
    ],
    []
  );
  
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      sorting
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <button 
            className={`btn ${showFilters ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FontAwesomeIcon icon={faFilter} className="me-2" />
            Filtres avancés
          </button>
          {hasActiveFilters && (
            <button 
              className="btn btn-outline-danger ms-2" 
              onClick={resetFilters}
            >
              <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
              Réinitialiser
            </button>
          )}
          {hasActiveFilters && (
            <span className="ms-3 badge bg-primary">
              {filteredData.length} résultat(s) sur {data.length} devis
            </span>
          )}
        </div>
        <div>
          <input
            className="form-control"
            value={globalFilter ?? ""}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Recherche rapide..."
          />
        </div>
      </div>
      
      {showFilters && (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Filtres avancés</h5>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Type de garantie</label>
                <select 
                  className="form-select"
                  name="garantie"
                  value={filters.garantie}
                  onChange={handleFilterChange}
                >
                  <option value="">Tous les types</option>
                  <option value="DO">DO</option>
                  <option value="TRC">TRC</option>
                  <option value="DO+TRC">DO+TRC</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Statut client</label>
                <select 
                  className="form-select"
                  name="client_vip"
                  value={filters.client_vip}
                  onChange={handleFilterChange}
                >
                  <option value="">Tous les clients</option>
                  <option value="true">VIP uniquement</option>
                  <option value="false">Standard uniquement</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Prime minimum</label>
                <input 
                  type="number"
                  className="form-control"
                  name="prime_min"
                  value={filters.prime_min}
                  onChange={handleFilterChange}
                  placeholder="Montant en €"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Prime maximum</label>
                <input 
                  type="number"
                  className="form-control"
                  name="prime_max"
                  value={filters.prime_max}
                  onChange={handleFilterChange}
                  placeholder="Montant en €"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Date minimum</label>
                <input 
                  type="date"
                  className="form-control"
                  name="date_creation_min"
                  value={filters.date_creation_min}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Date maximum</label>
                <input 
                  type="date"
                  className="form-control"
                  name="date_creation_max"
                  value={filters.date_creation_max}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-primary">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={
                      header.column.getCanSort()
                        ? header.column.getIsSorted()
                          ? header.column.getIsSorted() === "asc"
                            ? "asc"
                            : "desc"
                          : ""
                        : ""
                    }
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span>
                      {{
                        asc: <FontAwesomeIcon icon={faSortUp} className="ms-2" />,
                        desc: <FontAwesomeIcon icon={faSortDown} className="ms-2" />
                      }[header.column.getIsSorted()] ?? (
                        header.column.getCanSort() ? (
                          <FontAwesomeIcon icon={faSort} className="ms-2 text-muted" />
                        ) : null
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  Aucun devis trouvé
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DevisList;