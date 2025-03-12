import { ChangeEvent, useState } from 'react';
import { data } from '../utils/data';
import { BiSort } from 'react-icons/bi';
import { Project } from '../utils/Types';
import { FaSortAlphaDown, FaSortAlphaUpAlt } from 'react-icons/fa';
import { MdSort } from 'react-icons/md';
import { BsThreeDots } from 'react-icons/bs';

function Table() {
  const [projects, setProjects] = useState<Project[]>(data);
  const [sortDropdowVisible, setSortDropdownVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    sortingVariable: string;
    direction: string;
  } | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    country: '',
    project: '',
    status: ''
  });
  const [searchQuery] = useState('');

  function sortProjects(sortingVariable: keyof Project) {
    const sortedProjects = [...projects];
    if (
      sortConfig &&
      sortConfig.sortingVariable === sortingVariable &&
      sortConfig.direction === 'asc'
    ) {
      sortedProjects.sort((a, b) => (a[sortingVariable] > b[sortingVariable] ? -1 : 1));
      setSortConfig({ sortingVariable, direction: 'desc' });
    } else {
      sortedProjects.sort((a, b) => (a[sortingVariable] > b[sortingVariable] ? 1 : -1));
      setSortConfig({ sortingVariable, direction: 'asc' });
    }
    setProjects(sortedProjects);
  }

  function handleSortOptionClick(sortingVariable: keyof Project): void {
    sortProjects(sortingVariable);
    setSortDropdownVisible(false);
  }

  function handleFilterschange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [name]: value };
      setCurrentPage(1);

      const filteredProjects = data.filter(
        (project) =>
          (searchQuery === '' ||
            Object.values(project).some((val) =>
              String(val).toLowerCase().includes(searchQuery.toLowerCase())
            )) &&
          (updatedFilters.name === '' ||
            project.client.toLowerCase().includes(updatedFilters.name.toLowerCase())) &&
          (updatedFilters.country === '' ||
            project.country.toLowerCase().includes(updatedFilters.country.toLowerCase())) &&
          (updatedFilters.email === '' ||
            project.email.toLowerCase().includes(updatedFilters.email.toLowerCase())) &&
          (updatedFilters.project === '' ||
            project.project.toLowerCase().includes(updatedFilters.project.toLowerCase())) &&
          (updatedFilters.status === '' ||
            project.status.toLowerCase().includes(updatedFilters.status.toLowerCase()))
      );

      setProjects(filteredProjects);

      return updatedFilters; // Return updated filters for state update
    });
  }

  // pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentprojects = projects.slice(startIndex, itemsPerPage + startIndex);
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  console.log({ currentPage, itemsPerPage, startIndex, currentprojects, totalPages });

  function handlePageChange(pageNumber: number): void {
    setCurrentPage(pageNumber);
  }

  return (
    <div className="p-4">
      {/* sorting */}
      <div className="mb-5 flex items-center">
        <div className="sort relative">
          <button
            onClick={() => setSortDropdownVisible(!sortDropdowVisible)}
            className="btn flex items-center rounded border border-gray-700 bg-transparent px-4 py-2 text-white"
          >
            {sortConfig ? `By ${sortConfig.sortingVariable} ` : 'Sort'}
            {sortConfig ? (
              sortConfig.direction === 'desc' ? (
                <FaSortAlphaUpAlt />
              ) : (
                <FaSortAlphaDown />
              )
            ) : (
              <BiSort />
            )}
          </button>
          {sortDropdowVisible && (
            <div className="absolute top-full left-0 flex flex-col rounded border border-gray-700 bg-gray-800 shadow-lg">
              <button
                onClick={() => handleSortOptionClick('client')}
                className="btn w-full bg-transparent px-8 hover:bg-gray-700"
              >
                Name
              </button>
              <button
                onClick={() => handleSortOptionClick('country')}
                className="btn w-full bg-transparent px-8 hover:bg-gray-700"
              >
                Country
              </button>
              <button
                onClick={() => handleSortOptionClick('date')}
                className="btn w-full bg-transparent px-8 hover:bg-gray-700"
              >
                Date
              </button>
            </div>
          )}
        </div>
        <div className="fliters relative ml-4">
          <button
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="btn flex items-center rounded border border-gray-700 bg-transparent px-4 py-2 text-white"
          >
            <MdSort />
            Filters
          </button>
          {filtersVisible && (
            <div className="absolute top-full left-0 flex w-[20vw] flex-col gap-2 gap-y-3 rounded border border-gray-700 bg-gray-800 p-3 shadow-lg">
              <div>
                <label htmlFor="name">filter by name</label>
                <input
                  className="input"
                  value={filters.name}
                  onChange={handleFilterschange}
                  type="text"
                  name="name"
                  id="filter-name"
                />
              </div>
              <div>
                <label htmlFor="email">filter by email</label>
                <input
                  className="input"
                  value={filters.email}
                  onChange={handleFilterschange}
                  type="text"
                  name="email"
                  id="filter-email"
                />
              </div>
              <div>
                <label htmlFor="country">filter by country</label>
                <input
                  className="input"
                  value={filters.country}
                  onChange={handleFilterschange}
                  type="text"
                  name="country"
                  id="filter-country"
                />
              </div>
              <div>
                <label htmlFor="project">filter by project</label>
                <input
                  className="input"
                  value={filters.project}
                  onChange={handleFilterschange}
                  type="text"
                  name="project"
                  id="filter-project"
                />
              </div>
              <div>
                <label htmlFor="status">filter by status</label>
                <input
                  className="input"
                  value={filters.status}
                  onChange={handleFilterschange}
                  type="text"
                  name="status"
                  id="filter-status"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Main table */}
      <table className="min-w-full table-auto rounded border border-gray-700 text-white">
        <thead>
          <tr>
            <th className="px-5 py-3 text-left">image</th>
            <th className="px-5 py-3 text-left">client</th>
            <th className="px-5 py-3 text-left">country</th>
            <th className="px-5 py-3 text-left">email</th>
            <th className="px-5 py-3 text-left">project</th>
            <th className="px-5 py-3 text-left">progress</th>
            <th className="px-5 py-3 text-left">status</th>
            <th className="px-5 py-3 text-left">date</th>
            <th className="px-5 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentprojects.map((project) => (
            <tr key={project.date} className="border border-gray-700">
              <td className="px-4 py-2">
                <img
                  src={project.image}
                  alt=""
                  className="aspect-square w-20 rounded-xl object-cover"
                />
              </td>
              <td className="px-5 py-2">{project.client}</td>
              <td className="px-5 py-2">{project.country}</td>
              <td className="px-5 py-2">{project.email}</td>
              <td className="px-5 py-2">{project.project}</td>

              <td className="">
                <div className="flex flex-col items-start justify-center">
                  {project.progress === '100%' ? (
                    <div
                      className="h-2 rounded-lg bg-green-500"
                      style={{
                        width: project.progress
                      }}
                    ></div>
                  ) : (
                    <div
                      className="h-2 animate-pulse rounded-lg bg-teal-400/60"
                      style={{
                        width: project.progress
                      }}
                    ></div>
                  )}

                  <div>{project.progress}</div>
                </div>
              </td>

              <td className="px-5 py-2">{project.status}</td>
              <td className="px-5 py-2">{project.date}</td>
              <td className="px-5 py-2">
                <div className="btn relative border-none bg-transparent shadow-none">
                  <BsThreeDots />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* pagination */}
      <div className="mt-4 flex justify-end">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="btn mr-2 rounded border-none bg-gray-700 px-4 py-2 text-white shadow-none disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-white">
          {' '}
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="btn mr-2 rounded border-none bg-gray-700 px-5 py-1 text-white shadow-none disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
export default Table;
