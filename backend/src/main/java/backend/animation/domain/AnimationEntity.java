package backend.animation.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Builder
@Table(name = "animations")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AnimationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "path_url", nullable = false)
    private String pathUrl;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "running_time", nullable = false)
    private Long runningTime;

    @OneToMany(mappedBy = "animationEntity", cascade = CascadeType.REMOVE)
    private List<AnimationBestScoreEntity> animationBestScoreEntities;

    @OneToMany(mappedBy = "animationEntity", cascade = CascadeType.REMOVE)
    private List<AnimationScoreEntity> animationScoreEntities;
}
