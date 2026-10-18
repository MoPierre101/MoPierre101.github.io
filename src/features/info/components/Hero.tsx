import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { site } from "@/config/site";
import { hero } from "../data/hero";

/** Main's centered introduction, with a consistent reading width and spacing. */
export function Hero() {
  return (
    <section className="site-container info-page">
      <div className="info-content">
        <div className="info-introduction">
          <h1>{hero.intro}</h1>
          <p className="info-about">{hero.about}</p>
          <p className="info-education">{hero.education}</p>
        </div>
        <div className="info-skills">
          <h2>Skills</h2>
          <Table className="skills-table">
            <TableBody>
              {hero.skills.map((group) => (
                <TableRow key={group.category}>
                  <TableHead scope="row">{group.category}</TableHead>
                  <TableCell>{group.items.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="info-contact">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <p>{hero.location}</p>
        </div>
      </div>
    </section>
  );
}
